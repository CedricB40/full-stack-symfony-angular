<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(path: '/api/users', name: 'api_users_')]
class UserController extends AbstractController
{
    #[Route(path: '', name: 'index', methods: ['GET'])]
    public function index(UserRepository $repo): JsonResponse
    {
        $users = $repo->findAll();
        $data = array_map(fn(User $u) => [
            'id' => $u->getId(),
            'name' => $u->getName(),
            'email' => $u->getEmail(),
            'registeredAt' => $u->getRegisteredAt()->format('Y-m-d'),
        ], $users);

        return $this->json($data);
    }

    #[Route(path: '', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $body = json_decode($request->getContent(), true);

        if (!isset($body['name'], $body['email'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $user = new User();
        $user->setName($body['name']);
        $user->setEmail($body['email']);
        $user->setRegisteredAt(new \DateTimeImmutable());

        $em->persist($user);
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'registeredAt' => $user->getRegisteredAt()->format('Y-m-d'),
        ], 201);
    }

    /*------------------------------Mise à jour ------------------*/

    #[Route(path: '/{id}', name: 'update', methods: ['PATCH'])]
    public function update(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        UserRepository $repo
    ): JsonResponse {
        $user = $repo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['email'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $user->setName($data['name']);
        $user->setEmail($data['email']);
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'registeredAt' => $user->getRegisteredAt()->format('Y-m-d'),
        ]);
    }

    /*---------------------Delete-------------------------------*/

    #[Route(path: '/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EntityManagerInterface $em,
        UserRepository $repo
    ): JsonResponse {
        //  Recherche de l'utilisateur
        $user = $repo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        //  Suppression
        $em->remove($user);
        $em->flush();

        //  Réponse de confirmation
        return $this->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
